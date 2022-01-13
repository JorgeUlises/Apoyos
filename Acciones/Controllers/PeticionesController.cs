using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Acciones.Models;
using Acciones.ViewModel;
using Microsoft.Data.SqlClient;

using System.Data;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Data.Entity.Core.Objects;
//using System.Data.Entity;

namespace Acciones.Controllers
{
    public class PeticionesController : Controller
    {
        private readonly dbAccionesContext _context;

        public PeticionesController(dbAccionesContext context)
        {
            _context = context;
        }

        // GET: Peticiones
        public async Task<IActionResult> Index()
        {
            var LegId = _context.Legislaturas.Where(l => l.Estatus == 1).Select(l => l.LegislaturaId).SingleOrDefault();
            List<SelectListItem> LLegis = new SelectList(_context.Legislaturas, "LegislaturaId", "Nombre").ToList();
            var selected = LLegis.Where(x => x.Value == LegId.ToString()).First();
            selected.Selected = true;
            ViewData["LegBusqueda"] = LLegis;


            List<SelectListItem> Lcat = new SelectList(_context.Categorias, "CategoriaId", "Descripcion").ToList();
            Lcat.Insert(0, new SelectListItem() { Value = "0", Text = "TODO" });
            ViewData["ClasificacionBusqueda"] = Lcat;

            List<SelectListItem> Lorig = new SelectList(_context.OrigenPeticiones, "OrigenPeticionesId", "Nombre").ToList();
            //Lorig.Insert(0, new SelectListItem() { Value = "0", Text = "TODO" });
            ViewData["OrigenBusqueda"] = Lorig;

            List<SelectListItem> Lestatus = new SelectList(_context.EstatusPeticiones, "EstatusPeticionesId", "Nombre").ToList();
            //Lorig.Insert(0, new SelectListItem() { Value = "0", Text = "TODO" });
            ViewData["EstatusBusqueda"] = Lestatus;

            List<SelectListItem> LAsosiaciones = new SelectList(_context.Asociaciones, "AsociacionId", "Nombre").ToList();
            ViewData["AsociacionBusqueda"] = LAsosiaciones;

            List<SelectListItem> LDependencias = new SelectList(_context.Dependencias, "DependenciaId", "NombreDependecia").ToList();
            ViewData["DependenciaBusqueda"] = LDependencias;

            //var dbAccionesContext = _context.Peticiones.Include(p => p.Asociacion).Include(p => p.Dependecia).Include(p => p.Diputado).Include(p => p.EstatusNavigation).Include(p => p.Legislatura).Include(p => p.OrigenPeticion);
            var dbAccionesContext = _context.Peticiones;
            ViewBag.JavaScriptFunction = string.Format("FiltraPeticiones();");
            return View(await dbAccionesContext.ToListAsync());
        }

        // GET: Peticiones/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var peticione = await _context.Peticiones
                .Include(p => p.Asociacion)
                .Include(p => p.Dependecia)
                .Include(p => p.Diputado)
                .Include(p => p.EstatusNavigation)
                .Include(p => p.Legislatura)
                .Include(p => p.OrigenPeticion)
                .FirstOrDefaultAsync(m => m.PeticionId == id);
            if (peticione == null)
            {
                return NotFound();
            }

            return View(peticione);
        }

        // GET: Peticiones/Create
        public IActionResult Create()
        {
            //ViewData["AsociacionId"] = new SelectList(_context.Asociaciones, "AsociacionID", "Nombre");
            ViewData["DependeciaId"] = new SelectList(_context.Dependencias, "DependenciaId", "DependenciaId");
            ViewData["DiputadoId"] = new SelectList(_context.Diputados, "DiputadoId", "DiputadoId");
            ViewData["Estatus"] = new SelectList(_context.EstatusPeticiones, "EstatusPeticionesId", "Nombre");

            //List<SelectListItem> asociacion = new SelectList(_context.Asociaciones, "AsociacionId", "Nombre").ToList();
            //var selected = asociacion.Where(x => x.Value == "").First();
            //selected.Selected = true;
            //ViewData["Asociaciones"] = asociacion;

            ViewData["Asociaciones"] = new SelectList(_context.Asociaciones, "AsociacionId", "Nombre");
            ViewData["LegislaturaId"] = new SelectList(_context.Legislaturas, "LegislaturaId", "Nombre");
            ViewData["OrigenPeticionId"] = new SelectList(_context.OrigenPeticiones, "OrigenPeticionesId", "Nombre");

            Peticione peticion = new Peticione();
            peticion.FechaSolicitud = DateTime.Now;
            return View();
        }

        // POST: Peticiones/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("PeticionId,LegislaturaId,DiputadoId,AsociacionId,FechaSolicitud,FechaCompromiso,FechaConclusion,Descripcion,Distrito,OrigenPeticionId,DependeciaId,Estatus,Hito,Campo1,Campo2,FechaRegistro,FechaUltimoCambio,UsuarioRegistro")] Peticione peticione)
        {
            if (ModelState.IsValid)
            {
                _context.Add(peticione);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            //ViewData["AsociacionId"] = new SelectList(_context.Asociaciones, "AsociacionId", "Nombre", peticione.AsociacionId);
            ViewData["DependeciaId"] = new SelectList(_context.Dependencias, "DependenciaId", "DependenciaId", peticione.DependeciaId);
            ViewData["DiputadoId"] = new SelectList(_context.Diputados, "DiputadoId", "DiputadoId", peticione.DiputadoId);
            ViewData["Estatus"] = new SelectList(_context.EstatusPeticiones, "EstatusPeticionesId", "Nombre", peticione.Estatus);

            List<SelectListItem> asociacion = new SelectList(_context.Asociaciones, "AsociacionId", "Nombre").ToList();
            var selected = asociacion.Where(x => x.Value == "").First();
            selected.Selected = true;
            ViewData["Asociaciones"] = asociacion;

            ViewData["LegislaturaId"] = new SelectList(_context.Legislaturas, "LegislaturaId", "Nombre", peticione.LegislaturaId);
            ViewData["OrigenPeticionId"] = new SelectList(_context.OrigenPeticiones, "OrigenPeticionesId", "Nombre", peticione.OrigenPeticionId);
            return View(peticione);
        }

        // GET: Peticiones/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var peticione = await _context.Peticiones.FindAsync(id);
            if (peticione == null)
            {
                return NotFound();
            }
            ViewData["AsociacionId"] = new SelectList(_context.Asociaciones, "AsociacionId", "AsociacionId", peticione.AsociacionId);
            ViewData["DependeciaId"] = new SelectList(_context.Dependencias, "DependenciaId", "DependenciaId", peticione.DependeciaId);
            ViewData["DiputadoId"] = new SelectList(_context.Diputados, "DiputadoId", "DiputadoId", peticione.DiputadoId);

            /* Muestra Lista de Estatus con el valor seleccionado */
            var valorEstatus = _context.Peticiones.Where(p => p.PeticionId == id).Select(p => p.Estatus).SingleOrDefault();
            List<SelectListItem> ListaEstatus = new SelectList(_context.EstatusPeticiones, "EstatusPeticionesId", "Nombre", peticione.Estatus).ToList();
            var selected = ListaEstatus.Where(x => x.Value == valorEstatus.ToString()).First();
            selected.Selected = true;
            ViewData["Estatus"] = ListaEstatus;

            /* Nombre del solicitante */
            ViewData["NomSolicitante"] = _context.Ciudadanos.Where(c => c.CiudadanoId == peticione.SolicitanteId).Select(c => c.NombreCompleto).FirstOrDefault();

            ViewData["LegislaturaId"] = new SelectList(_context.Legislaturas, "LegislaturaId", "Nombre", peticione.LegislaturaId);
            ViewData["OrigenPeticionId"] = new SelectList(_context.OrigenPeticiones, "OrigenPeticionesId", "Nombre", peticione.OrigenPeticionId);

            ViewBag.JavaScriptFunction = string.Format("MuestraComplementoPeticion(" + id +");");
            return View(peticione);
        }

        // POST: Peticiones/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("PeticionId,LegislaturaId,DiputadoId,AsociacionId,FechaSolicitud,FechaCompromiso,FechaConclusion,Descripcion,Distrito,OrigenPeticionId,DependeciaId,Estatus,Hito,Campo1,Campo2,FechaRegistro,FechaUltimoCambio,UsuarioRegistro")] Peticione peticione)
        {
            if (id != peticione.PeticionId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(peticione);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!PeticioneExists(peticione.PeticionId))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            ViewData["AsociacionId"] = new SelectList(_context.Asociaciones, "AsociacionId", "AsociacionId", peticione.AsociacionId);
            ViewData["DependeciaId"] = new SelectList(_context.Dependencias, "DependenciaId", "DependenciaId", peticione.DependeciaId);
            ViewData["DiputadoId"] = new SelectList(_context.Diputados, "DiputadoId", "DiputadoId", peticione.DiputadoId);
            ViewData["Estatus"] = new SelectList(_context.EstatusPeticiones, "EstatusPeticionesId", "Nombre", peticione.Estatus);
            ViewData["LegislaturaId"] = new SelectList(_context.Legislaturas, "LegislaturaId", "Nombre", peticione.LegislaturaId);
            ViewData["OrigenPeticionId"] = new SelectList(_context.OrigenPeticiones, "OrigenPeticionesId", "Nombre", peticione.OrigenPeticionId);
            return View(peticione);
        }

        // GET: Peticiones/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var peticione = await _context.Peticiones
                .Include(p => p.Asociacion)
                .Include(p => p.Dependecia)
                .Include(p => p.Diputado)
                .Include(p => p.EstatusNavigation)
                .Include(p => p.Legislatura)
                .Include(p => p.OrigenPeticion)
                .FirstOrDefaultAsync(m => m.PeticionId == id);
            if (peticione == null)
            {
                return NotFound();
            }

            return View(peticione);
        }

        // POST: Peticiones/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var peticione = await _context.Peticiones.FindAsync(id);
            _context.Peticiones.Remove(peticione);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool PeticioneExists(int id)
        {
            return _context.Peticiones.Any(e => e.PeticionId == id);
        }


        /************************************************************
            Nueva Petición
        *************************************************************/
        [HttpPost]
        public int NuevaPeticion(int origenSolicitud, string folio, string fechaSolicitud, string fechaCompromiso, string fechaConclusion, int estatus, int solicitanteId, int asociacionId, string descripcionSolicitud, int hito)
        {
            Peticione peticion = new Peticione();
            peticion.OrigenPeticionId = origenSolicitud;
            peticion.Folio = folio ?? "";
            peticion.FechaSolicitud = fechaSolicitud == null || fechaSolicitud == "" ? new DateTime(1900, 1, 1) : Convert.ToDateTime(fechaSolicitud + " 00:00:00");
            peticion.FechaCompromiso = fechaCompromiso == null || fechaCompromiso == "" ? new DateTime(1900, 1, 1) : Convert.ToDateTime(fechaCompromiso + " 00:00:00");
            peticion.FechaConclusion = fechaConclusion == null || fechaConclusion == "" ? new DateTime(1900, 1, 1) : Convert.ToDateTime(fechaConclusion + " 00:00:00");
            peticion.Estatus = estatus;
            peticion.SolicitanteId = solicitanteId;
            peticion.AsociacionId = asociacionId;
            peticion.Descripcion = descripcionSolicitud ?? "";
            peticion.Hito = hito;
            peticion.Campo1 = "";
            peticion.Campo2 = 0;


            peticion.LegislaturaId = 2;
            peticion.DiputadoId = 8;
            peticion.Distrito = "V";
            peticion.FechaRegistro = DateTime.Now;
            peticion.FechaUltimoCambio = DateTime.Now;
            peticion.UsuarioRegistro = 1;
            peticion.DependeciaId = 1;

            //peticion.Asociacion = new Asociacione();
            //peticion.Dependecia = new Dependencia();
            //peticion.Diputado = new Diputado();
            //peticion.EstatusNavigation = new EstatusPeticione();
            //peticion.Legislatura = new Legislatura();
            //peticion.OrigenPeticion = new OrigenPeticione();

            try
            {
                _context.Add(peticion);
                _context.SaveChanges();

                if (peticion.PeticionId != 0)
                {
                    return peticion.PeticionId;
                }
                else
                {
                    Console.WriteLine("No se insertó en la BD la petición");
                    return -1;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Error al Insertar la petición: {0}", e.Message);
                return -2;
            }
        }


        /************************************************************
            Actualiza Petición
        *************************************************************/
        [HttpPost]
        public int ActualizaPeticion(int idPeticion, int origenSolicitud, string folio, string fechaSolicitud, string fechaCompromiso, string fechaConclusion, int estatus, int solicitanteId, int asociacionId, string descripcionSolicitud, int hito)
        {
            Peticione peticion = new Peticione();
            peticion.PeticionId = idPeticion;
            peticion.OrigenPeticionId = origenSolicitud;
            peticion.Folio = folio ?? "";
            peticion.FechaSolicitud = Convert.ToDateTime(fechaSolicitud + " 00:00:00");
            peticion.FechaCompromiso = Convert.ToDateTime(fechaCompromiso + " 00:00:00");
            peticion.FechaConclusion = Convert.ToDateTime(fechaConclusion + " 00:00:00");
            peticion.Estatus = estatus;
            peticion.SolicitanteId = solicitanteId;
            peticion.AsociacionId = asociacionId;
            peticion.Descripcion = descripcionSolicitud ?? "";
            peticion.Hito = hito;
            peticion.Campo1 = "";
            peticion.Campo2 = 0;


            peticion.LegislaturaId = 2;
            peticion.DiputadoId = 8;
            peticion.Distrito = "V";
            peticion.FechaRegistro = DateTime.Now;
            peticion.FechaUltimoCambio = DateTime.Now;
            peticion.UsuarioRegistro = 1;
            peticion.DependeciaId = 1;

            try
            {
                _context.Update(peticion);
                _context.SaveChanges();

                if (peticion.PeticionId != 0)
                {
                    return peticion.PeticionId;
                }
                else
                {
                    Console.WriteLine("No se insertó en la BD la petición");
                    return -1;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Error al Insertar la petición: {0}", e.Message);
                return -1;
            }
        }

        /****************************************************************************
            Guarda categoría y SubCategoria de una Petición
        *****************************************************************************/
        public int GuardaCategoriaSubCategoriaBD(int idPeticion, int categoriaId, int subCategoriaId)
        {
            int rtn;
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpAgregaUnaCategoria_SubCategoria";
            cmd.Parameters.Add("@PeticionID", System.Data.SqlDbType.Int).Value = idPeticion;
            cmd.Parameters.Add("@CategoriaID", System.Data.SqlDbType.Int).Value = categoriaId;
            cmd.Parameters.Add("@SubCategoriaID", System.Data.SqlDbType.Int).Value = subCategoriaId;
            cmd.Parameters.Add("@UsuarioID", System.Data.SqlDbType.Int).Value = 1;
            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            try
            {
                var nrow = cmd.ExecuteNonQuery();
                rtn = Convert.ToInt32(cmd.Parameters["@ReturnValue"].Value);
                conn.Close();
                if (nrow > 0)
                {
                    return 1;
                }
                else
                {
                    return 0;
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                conn.Close();
                return 0;
            }
        }


        /****************************************************************************
            Obtiene Categorías y Subcategorías de una Petición ID
        *****************************************************************************/
        [HttpGet]
        public List<ObjetoCategoriaSubCategoria> ObtieneListaCatSubCat(int idPeticion)
        {
            List<ObjetoCategoriaSubCategoria> ListaObjetos = new List<ObjetoCategoriaSubCategoria>();
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpObtieneCategoriasSubCategorias_De_Peticion";
            cmd.Parameters.Add("@PeticionID", System.Data.SqlDbType.Int).Value = idPeticion;
            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            SqlDataReader query = cmd.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    ObjetoCategoriaSubCategoria obj = new ObjetoCategoriaSubCategoria();
                    obj.PeticionCategoriaID = query.GetInt32(0);
                    obj.CategoriaID = query.GetInt32(1);
                    obj.DescripcionCat = query.GetString(2);
                    obj.PeticionSubcategoriaID = query.GetInt32(3);
                    obj.SubcategoriasID = query.GetInt32(4);
                    obj.DescripcionSubcat = query.GetString(5);
                    ListaObjetos.Add(obj);
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return ListaObjetos;
        }



        /****************************************************************************
            Obtiene Lista de Archivos de una Petición ID
        *****************************************************************************/
        [HttpGet]
        public List<ObjetoArchivos> ObtieneListaArchivos(int idPeticion)
        {
            List<ObjetoArchivos> ListaObjetos = new List<ObjetoArchivos>();
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpObtieneArchivosDePeticion";
            cmd.Parameters.Add("@PeticionID", System.Data.SqlDbType.Int).Value = idPeticion;
            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            SqlDataReader query = cmd.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    ObjetoArchivos obj = new ObjetoArchivos();
                    obj.PeticionID = query.GetInt32(0);
                    obj.NombreArchivo = query.GetString(1);
                    obj.URL = query.GetString(2);
                    ListaObjetos.Add(obj);
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return ListaObjetos;
        }


        /****************************************************************************
                    Subir Archivos Anexos a una Petición de apoyo
        *****************************************************************************/
        [Microsoft.AspNetCore.Mvc.HttpPost]
        [RequestSizeLimit(100_000_000)]
        public Microsoft.AspNetCore.Mvc.JsonResult SubirArchivoPeticion(List<IFormFile> files, int PeticionId)
        {
            bool isSuccess = false;
            string serverMessage;
            string nombreArchivoBD;
            string nombreArchivo;
            string extensionArchivo;
            string filePath;
            int posicionPunto;
            foreach (IFormFile item in files)
            {
                if (item.Length > 0)
                {
                    //subPath = numeroTurno;
                    nombreArchivo = item.FileName;
                    posicionPunto = item.FileName.IndexOf(".");
                    extensionArchivo = item.FileName.Substring(posicionPunto + 1);
                    
                    nombreArchivoBD = Convert.ToString(PeticionId) + "_" + numeroArchivosXpeticionId(PeticionId) + "." + extensionArchivo;

                    filePath = Path.Combine(@"C:\ARCHIVOS_APP\PETICIONES\", nombreArchivoBD);

                    FileInfo fi = new FileInfo(filePath);

                    try
                    {
                        if (fi.Exists)
                        {
                            fi.Delete();
                        }
                    }
                    catch (Exception e)
                    {
                        ViewBag.EstatusError = "Si el archivo está abierto, debe cerrarse";
                        View("Error");
                    }

                    try
                    {
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            item.CopyTo(stream);
                        }
                        //var URL = "http://10.11.10.150/Archivos/PETICIONES/" + nombreArchivoBD;
                        var URL = "/Archivos/PETICIONES/" + nombreArchivoBD;

                        GuardaReferenciaArchivoPeticionBD(nombreArchivo, nombreArchivoBD, URL, PeticionId);

                    }
                    catch
                    {
                        isSuccess = false;
                    }

                }
            }


            if (isSuccess)
            {
                isSuccess = true;
                serverMessage = "Los archivos han sido subidos";
            }
            else
            {
                isSuccess = false;

                serverMessage = "No fue posible subir los archivos";
            }
            return Json(new { IsSucccess = isSuccess, ServerMessage = serverMessage });
        }


        /****************************************************************************
            Guarda Nuevo Beneficiario de una Petición
        *****************************************************************************/
        [HttpPost]
        public int GuardaNuevoBeneficiario(int idPeticion, int beneficiarioId, string descripcionApoyo)
        {
            int rtn;
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpAgregaBeneficiario_Notas";
            cmd.Parameters.Add("@PeticionID", System.Data.SqlDbType.Int).Value = idPeticion;
            cmd.Parameters.Add("@BeneficiarioID", System.Data.SqlDbType.Int).Value = beneficiarioId;
            cmd.Parameters.Add("@Nota", System.Data.SqlDbType.VarChar, 3000).Value = descripcionApoyo;
            cmd.Parameters.Add("@UsuarioID", System.Data.SqlDbType.Int).Value = 1;
            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            try
            {
                var nrow = cmd.ExecuteNonQuery();
                rtn = Convert.ToInt32(cmd.Parameters["@ReturnValue"].Value);
                conn.Close();
                if (nrow > 0)
                {
                    return 1;
                }
                else
                {
                    return 0;
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                conn.Close();
                return 0;
            }
        }


        /****************************************************************************
            Actualiza descripción de apoyo a un Beneficiario
        *****************************************************************************/
        [HttpPost]
        public int ActualizaDescripcionApoyoBeneficiario(int idPeticion, int beneficiarioId, string descripcionApoyo)
        {
            int rtn;
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpActualizaDescApoyoBeneficiario";
            cmd.Parameters.Add("@PeticionID", System.Data.SqlDbType.Int).Value = idPeticion;
            cmd.Parameters.Add("@BeneficiarioID", System.Data.SqlDbType.Int).Value = beneficiarioId;
            cmd.Parameters.Add("@Nota", System.Data.SqlDbType.VarChar, 3000).Value = descripcionApoyo;
            cmd.Parameters.Add("@UsuarioID", System.Data.SqlDbType.Int).Value = 1;
            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            try
            {
                var nrow = cmd.ExecuteNonQuery();
                rtn = Convert.ToInt32(cmd.Parameters["@ReturnValue"].Value);
                conn.Close();
                if (nrow > 0)
                {
                    return 1;
                }
                else
                {
                    return 0;
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                conn.Close();
                return 0;
            }
        }

        /****************************************************************************
            Obtiene Lista de Beneficiarios de una Petición ID
        *****************************************************************************/
        [HttpGet]
        public List<ObjetoBeneficiarios> ObtieneListaBeneficiariosPeticionId(int idPeticion)
        {
            List<ObjetoBeneficiarios> ListaObjetos = new List<ObjetoBeneficiarios>();
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpObtieneBeneficiarios_De_Peticion";
            cmd.Parameters.Add("@PeticionID", System.Data.SqlDbType.Int).Value = idPeticion;
            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            SqlDataReader query = cmd.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    ObjetoBeneficiarios obj = new ObjetoBeneficiarios();
                    obj.CiudadanoID = query.GetInt32(0);
                    obj.PeticionID = query.GetInt32(1);
                    obj.Notas = query.GetString(2);
                    obj.Estatus = query.GetInt32(3);
                    obj.Latitud = query.GetString(4);
                    obj.Longitud = query.GetString(5);
                    obj.NombreCompleto = query.GetString(6);
                    obj.Colonia = query.GetString(7);
                    obj.Calle = query.GetString(8);
                    obj.BeneficiariosID = query.GetInt32(9);
                    ListaObjetos.Add(obj);
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return ListaObjetos;
        }


        /****************************************************************************
            Obtiene Bitácora de una Petición ID
        *****************************************************************************/
        [HttpGet]
        public IEnumerable<ObjetoBitacora> ObtieneBitacoraPeticionId(int idPeticion)
        {
            IEnumerable<ObjetoBitacora> ListaObjetos = new List<ObjetoBitacora>();
            ListaObjetos = (IEnumerable<ObjetoBitacora>)(
                    from bitacora in _context.Bitacoras.Where(b => b.PeticionId == idPeticion)
                    select new ObjetoBitacora
                    {
                        BitacoraBase = new Bitacora {
                            BitacoraId = bitacora.BitacoraId,
                            FechaRegistro = bitacora.FechaRegistro,
                            FechaCompromiso = bitacora.FechaCompromiso,
                            FechaConclusion = bitacora.FechaConclusion,
                            Estatus = bitacora.Estatus,
                            Descripcion = bitacora.Descripcion,
                            Responsable = bitacora.Responsable
                        },

                        ArchivosRelacionadosBitacora = (List<ArchivosBitacora>)(
                            from archivoBitacora in _context.ArchivosBitacoras.Where(ab => ab.BitacoraId == bitacora.BitacoraId)
                            select new ArchivosBitacora
                            {
                                ArchivosBitacoraId = archivoBitacora.ArchivosBitacoraId,
                                BitacoraId = archivoBitacora.BitacoraId,
                                NombreArchivo = archivoBitacora.NombreArchivo,
                                Url = archivoBitacora.Url
                            }
                        )
                    });
            return ListaObjetos;
        }



        /****************************************************************************
            Guarda Nueva Actividad en Bitácora
        *****************************************************************************/
        [HttpPost]
        public int GuardaNuevaActividadBitacora(int idPeticion, string actividad, string fechaRegistro, string fechaCompromiso, string fechaConclusion, int estatusBitacora, string responsableBitacora)
        {
            int rtn;
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpAgregaActividadBitacora";
            cmd.Parameters.Add("@PeticionID", System.Data.SqlDbType.Int).Value = idPeticion;
            cmd.Parameters.Add("@Descripcion", System.Data.SqlDbType.VarChar, 3000).Value = actividad;

            
            cmd.Parameters.Add("@FechaRegistro", System.Data.SqlDbType.DateTime).Value = fechaRegistro == null || fechaRegistro == "" ? new DateTime(1900, 1, 1) : Convert.ToDateTime(fechaRegistro + " 00:00:00");
            cmd.Parameters.Add("@FechaCompromiso", System.Data.SqlDbType.DateTime).Value = fechaCompromiso == null || fechaCompromiso == "" ? new DateTime(1900, 1, 1) : Convert.ToDateTime(fechaCompromiso + " 00:00:00");
            cmd.Parameters.Add("@FechaConclusion", System.Data.SqlDbType.DateTime).Value = fechaConclusion == null || fechaConclusion == "" ? new DateTime(1900, 1, 1) : Convert.ToDateTime(fechaConclusion + " 00:00:00");

            cmd.Parameters.Add("@Estatus", System.Data.SqlDbType.Int).Value = estatusBitacora;
            cmd.Parameters.Add("@Responsable", System.Data.SqlDbType.VarChar, 200).Value = responsableBitacora==null? "": responsableBitacora;
            cmd.Parameters.Add("@UsuarioID", System.Data.SqlDbType.Int).Value = 2;

            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            try
            {
                var nrow = cmd.ExecuteNonQuery();
                rtn = Convert.ToInt32(cmd.Parameters["@ReturnValue"].Value);
                conn.Close();
                if (nrow > 0)
                {
                    return 1;
                }
                else
                {
                    return 0;
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                conn.Close();
                return 0;
            }
        }

        /*******************************************************************
            Obtiene el número de Archivos Peticion ID 
        ********************************************************************/
        public Int32 numeroArchivosXpeticionId(int idDocumento)
        {
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            string stm = "SELECT Count(*) FROM [dbo].[ArchivosPeticiones] WHERE PeticionID = " + idDocumento;
            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count + 1;
        }

        /****************************************************************************
            Guarda Referencia de Archivos INICIATIVA en Base de Datos
        *****************************************************************************/
        public string GuardaReferenciaArchivoPeticionBD(string NombreArchivo, string NombreArchivoBD, string URL, int PeticionId)
        {
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpRegistraNuevoArchivoPeticiones";
            cmd.Parameters.Add("@NombreArchivoBD", System.Data.SqlDbType.VarChar, 150).Value = NombreArchivoBD;
            cmd.Parameters.Add("@NombreArchivo", System.Data.SqlDbType.VarChar, 200).Value = NombreArchivo;
            cmd.Parameters.Add("@URL", System.Data.SqlDbType.VarChar, 500).Value = URL;
            cmd.Parameters.Add("@PeticionId", System.Data.SqlDbType.Int).Value = PeticionId;
            cmd.Parameters.Add("@UsuarioID", System.Data.SqlDbType.Int).Value = 1;

            try
            {
                SqlDataReader query = cmd.ExecuteReader();
                conn.Close();

                return "OK";
            }
            catch (DbUpdateConcurrencyException)
            {
                conn.Close();
                return "NO";
            }
        }



        /************************************************************
            Obtiene Todas las SOLICITUDES DE PETICIONES con Argumentos para WHERE
        *************************************************************/
        public IEnumerable<ObjetoPeticiones> ObtienePeticiones(int RegXpag, int offsetPeticiones, int LegislaturaID, int origenPeticion, string folio, int hito, string nombreSolicitante, string descripcion, int categoriaId, int subCategoriaId, int estatusId, string fechaInicioSolicitud, string fechaFinSolicitud, string fechaInicioConclusion, string fechaFinConclusion, int asociacionId, int dependenciaId)
        {
            int diputadoId = 8;
            IEnumerable<ObjetoPeticiones> ListaObjetos = new List<ObjetoPeticiones>();
            ListaObjetos = (IEnumerable<ObjetoPeticiones>)(
                    from peticiones in _context.Peticiones.Where(pet => pet.LegislaturaId == LegislaturaID && pet.DiputadoId == diputadoId)
                    join origenPeticiones in _context.OrigenPeticiones on peticiones.OrigenPeticionId equals origenPeticiones.OrigenPeticionesId
                    join ciudadanos in _context.Ciudadanos on peticiones.SolicitanteId equals ciudadanos.CiudadanoId
                    join estatusPeticiones in _context.EstatusPeticiones on peticiones.Estatus equals estatusPeticiones.EstatusPeticionesId
                    join legislatura in _context.Legislaturas on peticiones.LegislaturaId equals legislatura.LegislaturaId

                    //where true && String.IsNullOrEmpty(folio) ? (true) : peticiones.Folio.Contains(folio)
                    where true && String.IsNullOrEmpty(nombreSolicitante) ? (true) : ciudadanos.NombreCompleto.Contains(nombreSolicitante)
                    where true && String.IsNullOrEmpty(descripcion) ? (true) : peticiones.Descripcion.Contains(descripcion)
                    where true && String.IsNullOrEmpty(folio) ? (true) : peticiones.Folio.Contains(folio)
                    where true && (origenPeticion <= 1) ? (true) : peticiones.OrigenPeticionId == origenPeticion
                    where true && (estatusId <= 2) ? (true) : peticiones.Estatus == estatusId
                    where true && (asociacionId <= 1) ? (true) : peticiones.AsociacionId == asociacionId
                    where true && (dependenciaId <= 1) ? (true) : peticiones.DependeciaId == dependenciaId
                    where true && (hito < 0) ? (true) : peticiones.Hito == hito
                    where true && (fechaInicioSolicitud == "0" && fechaFinSolicitud == "0") ? (true) : _context.Peticiones.Where(p => p.FechaRegistro >= DateTime.ParseExact(fechaInicioSolicitud, "dd-MM-yyyy HH:mm", null) && p.FechaSolicitud <= DateTime.ParseExact(fechaFinSolicitud, "dd-MM-yyyy HH:mm", null)).Select(p => p.PeticionId).Contains(peticiones.PeticionId)
                    where true && (categoriaId == 0) ? (true) : _context.PeticionCategoria.Where(pc => pc.PeticionId == peticiones.PeticionId && pc.CategoriaId == categoriaId).Select(pc => pc.PeticionId).Contains(peticiones.PeticionId)
                    where true && (subCategoriaId == 0) ? (true) : _context.PeticionSubcategoria.Where(psc => psc.PeticionId == peticiones.PeticionId && psc.SubcategoriaId == subCategoriaId).Select(psc => psc.PeticionId).Contains(peticiones.PeticionId)

                    //orderby Convert.ToInt32(peticiones.Folio) descending
                    orderby peticiones.FechaRegistro descending

                    select new ObjetoPeticiones
                    {
                        PeticionId = peticiones.PeticionId,
                        LegislaturaId = (int)peticiones.LegislaturaId,
                        LegislaturaNombre = legislatura.Nombre,
                        NumFolio = peticiones.Folio,
                        OrigenPeticionId = (int)peticiones.OrigenPeticionId,
                        OrigenPeticion = origenPeticiones.Nombre,
                        NombreCompleto = ciudadanos.NombreCompleto,
                        Paterno = ciudadanos.Paterno,
                        Materno = ciudadanos.Materno,
                        Nombre = ciudadanos.Nombre,
                        Descripcion = peticiones.Descripcion,
                        EstatusId = (int)peticiones.Estatus,
                        diasTranscurridos = (int) (DateTime.Now - (DateTime)peticiones.FechaSolicitud).Days, 
                        diasSolucion = (int) (peticiones.FechaConclusion != DateTime.Parse("1900-01-01 00:00:00.000")?( (DateTime)peticiones.FechaConclusion - (DateTime)peticiones.FechaSolicitud).Days: -1),
                        Estatus = estatusPeticiones.Nombre,
                        FechaRegistro = peticiones.FechaRegistro != null ? ((DateTime)peticiones.FechaRegistro).ToShortDateString() : "",
                        detalleCategoriaSubcategoria = (List<DetalleCategoriaSubcategoria>)(
                            from peticionesCategoria in _context.PeticionCategoria.Where(petC => petC.PeticionId == peticiones.PeticionId)
                            join peticionesSubcategoria in _context.PeticionSubcategoria on peticionesCategoria.PeticionCategoriaId equals peticionesSubcategoria.PeticionCategoriaId
                            join categoria in _context.Categorias on peticionesCategoria.CategoriaId equals categoria.CategoriaId
                            join subcategoria in _context.Subcategorias on peticionesSubcategoria.SubcategoriaId equals subcategoria.SubcategoriasId
                            select new DetalleCategoriaSubcategoria
                            {
                                PeticionId = (int)peticionesCategoria.PeticionId,
                                CategoriaId = (int)peticionesCategoria.CategoriaId,
                                Categoria = categoria.Descripcion,
                                SubcategoriaId = (int)peticionesSubcategoria.SubcategoriaId,
                                Subcategoria = subcategoria.Descripcion
                            }
                        )
                    }).Skip(offsetPeticiones).Take(RegXpag);
            return ListaObjetos;
        }

        /************************************************************
            Obtiene Número de Registros aplicando FILTRO
        *************************************************************/
        public int ObtieneNumeroPeticionesXfiltro(int LegislaturaID, int origenPeticion, string folio, int hito, string nombreSolicitante, string descripcion, int categoriaId, int subCategoriaId, int estatusId, string fechaInicioSolicitud, string fechaFinSolicitud, string fechaInicioConclusion, string fechaFinConclusion, int asociacionId, int dependenciaId)
        {
            int diputadoId = 8;
            var results =
                    from peticiones in _context.Peticiones.Where(pet => pet.LegislaturaId == LegislaturaID && pet.DiputadoId == diputadoId)
                    join origenPeticiones in _context.OrigenPeticiones on peticiones.OrigenPeticionId equals origenPeticiones.OrigenPeticionesId
                    join ciudadanos in _context.Ciudadanos on peticiones.SolicitanteId equals ciudadanos.CiudadanoId
                    join estatusPeticiones in _context.EstatusPeticiones on peticiones.Estatus equals estatusPeticiones.EstatusPeticionesId
                    join legislatura in _context.Legislaturas on peticiones.LegislaturaId equals legislatura.LegislaturaId

                    //where true && String.IsNullOrEmpty(folio) ? (true) : peticiones.Folio.Contains(folio)
                    where true && String.IsNullOrEmpty(nombreSolicitante) ? (true) : ciudadanos.NombreCompleto.Contains(nombreSolicitante)
                    where true && String.IsNullOrEmpty(descripcion) ? (true) : peticiones.Descripcion.Contains(descripcion)
                    where true && String.IsNullOrEmpty(folio) ? (true) : peticiones.Folio.Contains(folio)
                    where true && (origenPeticion <= 1) ? (true) : peticiones.OrigenPeticionId == origenPeticion
                    where true && (estatusId <= 2) ? (true) : peticiones.Estatus == estatusId
                    where true && (asociacionId <= 1) ? (true) : peticiones.AsociacionId == asociacionId
                    where true && (dependenciaId <= 1) ? (true) : peticiones.DependeciaId == dependenciaId
                    where true && (hito < 0) ? (true) : peticiones.Hito == hito
                    where true && (fechaInicioSolicitud == "0" && fechaFinSolicitud == "0") ? (true) : _context.Peticiones.Where(p => p.FechaRegistro >= DateTime.ParseExact(fechaInicioSolicitud, "dd-MM-yyyy HH:mm", null) && p.FechaSolicitud <= DateTime.ParseExact(fechaFinSolicitud, "dd-MM-yyyy HH:mm", null)).Select(p => p.PeticionId).Contains(peticiones.PeticionId)
                    where true && (categoriaId == 0) ? (true) : _context.PeticionCategoria.Where(pc => pc.PeticionId == peticiones.PeticionId && pc.CategoriaId == categoriaId).Select(pc => pc.PeticionId).Contains(peticiones.PeticionId)
                    where true && (subCategoriaId == 0) ? (true) : _context.PeticionSubcategoria.Where(psc => psc.PeticionId == peticiones.PeticionId && psc.SubcategoriaId == subCategoriaId).Select(psc => psc.PeticionId).Contains(peticiones.PeticionId)

                    //orderby Convert.ToInt32(peticiones.Folio) descending

                    select peticiones.PeticionId;

            return results.Count();
        }


        /************************************************************
            Obtiene Una Iniciativa identificada por un Id
        *************************************************************/
        public IEnumerable<ObjetoPeticion> ObtieneDetallePeticion(int PeticionId)
        {
            IEnumerable<ObjetoPeticion> ListaObjetos = new List<ObjetoPeticion>();
            ListaObjetos = (IEnumerable<ObjetoPeticion>)(
                    from peticiones in _context.Peticiones.Where(pet => pet.PeticionId == PeticionId)
                    join asociaciones in _context.Asociaciones on peticiones.AsociacionId equals asociaciones.AsociacionId
                    join origenPeticiones in _context.OrigenPeticiones on peticiones.OrigenPeticionId equals origenPeticiones.OrigenPeticionesId
                    join dependencias in _context.Dependencias on peticiones.DependeciaId equals dependencias.DependenciaId
                    join estatus in _context.EstatusPeticiones on peticiones.Estatus equals estatus.EstatusPeticionesId
                    join ciudadanos in _context.Ciudadanos on peticiones.SolicitanteId equals ciudadanos.CiudadanoId
                    select new ObjetoPeticion
                    {
                        PeticionId = peticiones.PeticionId,
                        AsociacionId = (int)peticiones.AsociacionId,
                        AsociacionNombre = asociaciones.Nombre,
                        Folio = peticiones.Folio,
                        FechaSolicitud = peticiones.FechaSolicitud,
                        FechaCompromiso = peticiones.FechaCompromiso,
                        FechaConclusion = peticiones.FechaConclusion,
                        Descripcion = peticiones.Descripcion,
                        OrigenPeticionId = peticiones.OrigenPeticionId,
                        OrigenPeticionNombre = origenPeticiones.Nombre,
                        DependeciaId = peticiones.DependeciaId,
                        DependenciaNombre = dependencias.NombreDependecia,
                        Estatus = peticiones.Estatus,
                        EstatusDescripcion = estatus.Nombre,
                        Hito = peticiones.Hito,
                        SolicitanteId = peticiones.SolicitanteId,
                        SolicitanteNombre = ciudadanos.NombreCompleto
                    });
            return ListaObjetos;
        }


        /*******************************************************************
            Obtiene el número de Peticiones
        ********************************************************************/
        public Int32 numeroPeticiones(int LegislaturaId)
        {
            int diputadoId = 8;
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            string stm = "SELECT Count(*) FROM [dbo].[Peticiones] WHERE LegislaturaID = " + LegislaturaId + " AND DiputadoID = " + diputadoId;
            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count + 1;
        }


        /*******************************************************************
            Obtiene el número de Peticiones Hitos
        ********************************************************************/
        public Int32 numeroPeticionesHitos(int LegislaturaId)
        {
            int diputadoId = 8;
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            string stm = "SELECT Count(*) FROM [dbo].[Peticiones] WHERE LegislaturaID = " + LegislaturaId + " AND DiputadoID = " + diputadoId + " AND Hito=1";
            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count;
        }

        /*******************************************************************
            Obtiene el número de Eventos
        ********************************************************************/
        public Int32 numeroEventos(int LegislaturaId)
        {
            int diputadoId = 8;
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            string stm = "SELECT Count(*) FROM [dbo].[Eventos] WHERE LegislaturaID = " + LegislaturaId + " AND DiputadoID = " + diputadoId;
            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count;
        }

        /*******************************************************************
            Obtiene el número de Visitas
        ********************************************************************/
        public Int32 numeroVisitas(int LegislaturaId)
        {
            int diputadoId = 8;
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            string stm = "SELECT Count(*) FROM [dbo].[Visitas] WHERE LegislaturaID = " + LegislaturaId + " AND DiputadoID = " + diputadoId;
            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count;
        }

        /*******************************************************************
            Obtiene el número de Ciudadanos
        ********************************************************************/
        public Int32 numeroCiudadanos(int LegislaturaId)
        {
            int diputadoId = 8;
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            string stm = "SELECT Count(*) FROM [dbo].[Ciudadanos]" ;
            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count;
        }

        /*******************************************************************
            Obtiene el número de Asociaciones
        ********************************************************************/
        public Int32 numeroAsociaciones(int LegislaturaId)
        {
            int diputadoId = 8;
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            string stm = "SELECT Count(*) FROM [dbo].[Asociaciones]";
            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count-1;
        }

        /*******************************************************************
            Obtiene Resumen de Peticiones X estatus
        ********************************************************************/
        public IEnumerable<ObjetoEstatusPeticiones> resumenXestatus(int LegislaturaId)
        {
            int diputadoId = 8;
            List<ObjetoEstatusPeticiones> ListaObjetos = new List<ObjetoEstatusPeticiones>();
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            //SqlCommand cmd = conn.CreateCommand();
            
            conn.Open();

            string stm = "SELECT EP.Nombre, " +
                        "(SELECT Count(*) FROM [dbo].[peticiones] WHERE LegislaturaID = " + LegislaturaId + " AND DiputadoID = " + diputadoId + " AND Estatus = EP.EstatusPeticionesID)" +
                        " FROM EstatusPeticiones AS EP";

            SqlCommand cmd_p = new SqlCommand(stm, conn);

            SqlDataReader query = cmd_p.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    ObjetoEstatusPeticiones obj = new ObjetoEstatusPeticiones();
                    obj.estatus = query.GetString(0);
                    obj.cantidad = query.GetInt32(1);
                    ListaObjetos.Add(obj);
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return ListaObjetos;
        }

        /*******************************************************************
            Obtiene Resumen de Peticiones X Clasificicación
        ********************************************************************/
        [HttpGet]
        public List<ObjetoClasificacionEstatus> resumenXclasificacion(int LegislaturaID)
        {
            List<ObjetoClasificacionEstatus> ListaObjetos = new List<ObjetoClasificacionEstatus>();
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpResumenPeticionXcategoriaXestatus";
            cmd.Parameters.Add("@LegislaturaId", System.Data.SqlDbType.Int).Value = LegislaturaID;
            //cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            SqlDataReader query = cmd.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    ObjetoClasificacionEstatus obj = new ObjetoClasificacionEstatus();
                    obj.Clasificacion = query.GetString(1);
                    obj.SinClasificacion = query.GetInt32(2);
                    obj.Solicitado = query.GetInt32(3);
                    obj.Atendido = query.GetInt32(4);
                    obj.Cancelado = query.GetInt32(5);
                    obj.EnProceso = query.GetInt32(6);
                    obj.NoProcede = query.GetInt32(7);
                    obj.Reasignado = query.GetInt32(8);
                    obj.Total = query.GetInt32(2) + query.GetInt32(3)+ query.GetInt32(4)+ query.GetInt32(5)+ query.GetInt32(6)+ query.GetInt32(7)+ query.GetInt32(8);
                    ListaObjetos.Add(obj);
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return ListaObjetos;
        }

        /*******************************************************************
            Obtiene Resumen de Eventos X estatus
        ********************************************************************/
        public IEnumerable<ObjetoEstatusPeticiones> resumenXeventos(int LegislaturaId)
        {
            int diputadoId = 8;
            List<ObjetoEstatusPeticiones> ListaObjetos = new List<ObjetoEstatusPeticiones>();
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            //SqlCommand cmd = conn.CreateCommand();

            conn.Open();

            string stm = "SELECT EP.Nombre, " +
                        "(SELECT Count(*) FROM [dbo].[peticiones] WHERE LegislaturaID = " + LegislaturaId + " AND DiputadoID = " + diputadoId + " AND Estatus = EP.EstatusPeticionesID)" +
                        " FROM EstatusPeticiones AS EP";

            SqlCommand cmd_p = new SqlCommand(stm, conn);

            SqlDataReader query = cmd_p.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    ObjetoEstatusPeticiones obj = new ObjetoEstatusPeticiones();
                    obj.estatus = query.GetString(0);
                    obj.cantidad = query.GetInt32(1);
                    ListaObjetos.Add(obj);
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return ListaObjetos;
        }

        /************************************************************
            Busca si existe un Número de Folio
        *************************************************************/
        public int BuscaNumeroFolio(string folio)
        {
            var TotalRegistrosEncontrados = _context.Peticiones.Where(p => p.Folio == folio).Count();
            return TotalRegistrosEncontrados;
        }

        /***********************************************************************************************
         *  Carga los valores del Combo de Subcategoria, dependiendo de la Categoría seleccionada
         ***********************************************************************************************/
        public JsonResult CargaValoresSubCategoria(int clasificacionId)
        {
            List<SelectListItem> resultado;
            
            resultado = _context.Subcategorias.Where(sc => sc.CategoriaId == clasificacionId).Select(sc => new SelectListItem
            {
                Value = sc.SubcategoriasId.ToString(),
                Text = sc.Descripcion
            }).ToList();
            resultado.Insert(0, new SelectListItem() { Value = "0", Text = "TODO" });
            return Json(resultado);
        }

        /********************************************************************
               O B J E T O S
         *********************************************************************/
        public partial class ObjetoCategoriaSubCategoria
        {
            public int PeticionCategoriaID { get; set; }
            public int CategoriaID { get; set; }
            public string DescripcionCat { get; set; }
            public int PeticionSubcategoriaID { get; set; }
            public int SubcategoriasID { get; set; }
            public string DescripcionSubcat { get; set; }
        }

        public partial class ObjetoArchivos
        {
            public int PeticionID { get; set; }
            public string NombreArchivo { get; set; }
            public string URL { get; set; }
        }

        public partial class ObjetoBeneficiarios
        {
            public int BeneficiariosID { get; set; }
            public int CiudadanoID { get; set; }
            public string NombreCompleto { get; set; }
            public string Colonia { get; set; }
            public string Calle { get; set; }
            public int PeticionID { get; set; }
            public string Notas { get; set; }
            public int Estatus { get; set; }
            public string Latitud { get; set; }
            public string Longitud { get; set; }
        }
        public partial class ObjetoEstatusPeticiones
        {
            public int estatusId { get; set; }
            public string estatus { get; set; }
            public int cantidad { get; set; }
        }
        public partial class ObjetoClasificacionEstatus
        {
            public string Clasificacion { get; set; }
            public int SinClasificacion { get; set; }
            public int Solicitado { get; set; }
            public int Atendido { get; set; }
            public int Cancelado { get; set; }
            public int EnProceso { get; set; }
            public int NoProcede { get; set; }
            public int Reasignado { get; set; }
            public int Total { get; set; }
        }

        public partial class ObjetoPeticion
        {
            public int PeticionId { get; set; }
            public int? AsociacionId { get; set; }
            public string AsociacionNombre { get; set; }
            public string Folio { get; set; }
            public DateTime? FechaSolicitud { get; set; }
            public DateTime? FechaCompromiso { get; set; }
            public DateTime? FechaConclusion { get; set; }
            public string Descripcion { get; set; }
            public int? OrigenPeticionId { get; set; }
            public string OrigenPeticionNombre { get; set; }
            public int? DependeciaId { get; set; }
            public string DependenciaNombre { get; set; }
            public int? Estatus { get; set; }
            public string EstatusDescripcion { get; set; }
            public int? Hito { get; set; }
            public int? SolicitanteId { get; set; }
            public string SolicitanteNombre { get; set; }
        }
    }
}