using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Acciones.Models;

namespace Acciones.Controllers
{
    public class CiudadanoesController : Controller
    {
        private readonly dbAccionesContext _context;

        public CiudadanoesController(dbAccionesContext context)
        {
            _context = context;
        }

        // GET: Ciudadanoes
        public async Task<IActionResult> Index()
        {
            var dbAccionesContext = _context.Ciudadanos.Include(c => c.Calle).Include(c => c.Colonia);
            return View(await dbAccionesContext.ToListAsync());
        }

        // GET: Ciudadanoes/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var ciudadano = await _context.Ciudadanos
                .Include(c => c.Calle)
                .Include(c => c.Colonia)
                .FirstOrDefaultAsync(m => m.CiudadanoId == id);
            if (ciudadano == null)
            {
                return NotFound();
            }

            return View(ciudadano);
        }

        // GET: Ciudadanoes/Create
        public IActionResult Create()
        {
            ViewData["CalleId"] = new SelectList(_context.Calles, "CalleId", "NombreCalle");
            ViewData["ColoniaId"] = new SelectList(_context.Colonias, "ColoniaId", "NombreColonia");
            return View();
        }

        // POST: Ciudadanoes/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("CiudadanoId,Paterno,Materno,Nombre,ColoniaId,CalleId,NumExterior,NumInterior,Cp,Email,Telefono,Partido,TipoMiembro,Distrito,Seccion,FechaNacimiento,Estatus,Genero,Notas,Campo1,Campo2,Latitud,Longitud,FechaRegistro,FechaUltimoCambio,UsuarioRegistroId")] Ciudadano ciudadano)
        {
            if (ModelState.IsValid)
            {
                _context.Add(ciudadano);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["CalleId"] = new SelectList(_context.Calles, "CalleId", "NombreCalle", ciudadano.CalleId);
            ViewData["ColoniaId"] = new SelectList(_context.Colonias, "ColoniaId", "NombreColonia", ciudadano.ColoniaId);
            return View(ciudadano);
        }

        // GET: Ciudadanoes/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var ciudadano = await _context.Ciudadanos.FindAsync(id);
            if (ciudadano == null)
            {
                return NotFound();
            }
            ViewData["CalleId"] = new SelectList(_context.Calles, "CalleId", "NombreCalle", ciudadano.CalleId);
            ViewData["ColoniaId"] = new SelectList(_context.Colonias, "ColoniaId", "NombreColonia", ciudadano.ColoniaId);
            return View(ciudadano);
        }

        // POST: Ciudadanoes/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("CiudadanoId,Paterno,Materno,Nombre,ColoniaId,CalleId,NumExterior,NumInterior,Cp,Email,Telefono,Partido,TipoMiembro,Distrito,Seccion,FechaNacimiento,Estatus,Genero,Notas,Campo1,Campo2,Latitud,Longitud,FechaRegistro,FechaUltimoCambio,UsuarioRegistroId")] Ciudadano ciudadano)
        {
            if (id != ciudadano.CiudadanoId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(ciudadano);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CiudadanoExists(ciudadano.CiudadanoId))
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
            ViewData["CalleId"] = new SelectList(_context.Calles, "CalleId", "NombreCalle", ciudadano.CalleId);
            ViewData["ColoniaId"] = new SelectList(_context.Colonias, "ColoniaId", "NombreColonia", ciudadano.ColoniaId);
            return View(ciudadano);
        }

        // GET: Ciudadanoes/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var ciudadano = await _context.Ciudadanos
                .Include(c => c.Calle)
                .Include(c => c.Colonia)
                .FirstOrDefaultAsync(m => m.CiudadanoId == id);
            if (ciudadano == null)
            {
                return NotFound();
            }

            return View(ciudadano);
        }

        // POST: Ciudadanoes/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var ciudadano = await _context.Ciudadanos.FindAsync(id);
            _context.Ciudadanos.Remove(ciudadano);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool CiudadanoExists(int id)
        {
            return _context.Ciudadanos.Any(e => e.CiudadanoId == id);
        }

        /************************************************************
            Inserta Nuevo Ciudadano
        *************************************************************/
        [HttpPost]
        public int InsertaNuevoCiudadano(string paterno, string materno, string nombre, string fechaNacimiento, string genero, int coloniaId, int calleId, string numExterior, string numInterior, int cp, string email, string telefono, string partido, string miembro, string seccion, string latitud, string longitud, string notas)
        {
            if (BuscaPersonaXnombre(paterno, materno, nombre) > 0)       //  Verifica que no exista otra persona con el mismo nombre y apellidos
            {
                return 0;
            }

            Ciudadano ciudadano = new Ciudadano();
            ciudadano.Paterno = paterno;
            ciudadano.Materno = materno;
            ciudadano.Nombre = nombre;
            ciudadano.ColoniaId = coloniaId;
            ciudadano.CalleId = calleId;
            ciudadano.NumExterior = numExterior;
            ciudadano.NumInterior = numInterior;
            ciudadano.Cp = cp;
            ciudadano.Email = email;
            ciudadano.Telefono = telefono;
            ciudadano.Partido = partido==null?"":partido;
            ciudadano.TipoMiembro = miembro==null?"":miembro;
            ciudadano.Distrito = "V";
            ciudadano.Seccion = seccion;
            ciudadano.FechaNacimiento = fechaNacimiento==null? new DateTime(1900, 1, 1): Convert.ToDateTime(fechaNacimiento + " 00:00:00");
            ciudadano.Estatus = 1;
            ciudadano.Genero = genero;
            ciudadano.Notas = notas;
            ciudadano.Campo1 = "";
            ciudadano.Campo2 = 0;
            ciudadano.Latitud = latitud;
            ciudadano.Longitud = longitud;
            ciudadano.FechaRegistro = DateTime.Now;
            ciudadano.FechaUltimoCambio = DateTime.Now;
            ciudadano.UsuarioRegistroId = 1;
            ciudadano.NombreCompleto = paterno + " " + materno + " " + nombre;

            try
            {
                _context.Ciudadanos.Add(ciudadano);
                _context.SaveChanges();

                if (ciudadano.CiudadanoId != 0)
                {
                    return ciudadano.CiudadanoId;

                }
                else
                {
                    Console.WriteLine("No se insertó en la BD el ciudadano");
                    return -1;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Error al Insertar un ciudadano: {0}", e.Message);
                return -1;
            }
        }


        /*******************************************************************
            Busca si existe una persona con el mismo nombre y apellidos
        ********************************************************************/
        public int BuscaPersonaXnombre(string paterno, string materno, string nombre)
        {
            var TotalRegistrosEncontrados = _context.Ciudadanos.Where(c => c.Paterno== paterno && c.Materno==materno && c.Nombre==nombre).Count();
            return TotalRegistrosEncontrados;
        }

        /*************************************************************************************
         *  Buscar Ciudadano
         *************************************************************************************/
        public JsonResult BusquedaCiudadano(string term)
        {
            {
                var nombresColonias = _context.Ciudadanos.Where(c => c.NombreCompleto.Contains(term)).Select(c => new { aNombreCiudadano = c.NombreCompleto, id = c.CiudadanoId }).ToList();
                return Json(nombresColonias);
            }
        }

    }
}
